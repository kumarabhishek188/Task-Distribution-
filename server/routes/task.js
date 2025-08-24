const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Agent = require('../models/Agent');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const { distributeTasks } = require('../services/taskService');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * POST /api/tasks/upload
 * Auth: Bearer token (admin)
 * Multipart form-data with field 'file' containing CSV/XLS/XLSX.
 * Distributes leads round-robin among existing agents and creates Task docs.
 */
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  const file = req.file;
  let responded = false;
  const safeRespond = (status, payload) => {
    if (!responded) {
      responded = true;
      return res.status(status).json(payload);
    }
  };

  try {
    const agents = await Agent.find();
    if (!agents.length) return safeRespond(400, { message: 'No agents found' });
    if (!file) return safeRespond(400, { message: 'No file uploaded' });

    const ext = path.extname(file.originalname || '').toLowerCase();
    const isCsv = file.mimetype === 'text/csv' || ext === '.csv';
    const isExcel = (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      ext === '.xlsx' || ext === '.xls'
    );

    let leads = [];
    if (isCsv) {
      const stream = fs.createReadStream(file.path)
        .pipe(csv());

      stream.on('data', (data) => leads.push(data));
      stream.on('error', (e) => {
        try { fs.unlinkSync(file.path); } catch {}
        safeRespond(400, { message: 'Invalid CSV file' });
      });
      stream.on('end', async () => {
        try {
          if (!leads.length) {
            try { fs.unlinkSync(file.path); } catch {}
            return safeRespond(400, { message: 'No leads found in file' });
          }
          await distributeTasks(leads, agents);
          try { fs.unlinkSync(file.path); } catch {}
          safeRespond(200, { message: 'Tasks distributed' });
        } catch (e) {
          try { fs.unlinkSync(file.path); } catch {}
          safeRespond(500, { message: 'Failed to process CSV' });
        }
      });
    } else if (isExcel) {
      try {
        const workbook = xlsx.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        leads = xlsx.utils.sheet_to_json(sheet);
        if (!leads.length) {
          try { fs.unlinkSync(file.path); } catch {}
          return safeRespond(400, { message: 'No leads found in file' });
        }
        await distributeTasks(leads, agents);
        try { fs.unlinkSync(file.path); } catch {}
        return safeRespond(200, { message: 'Tasks distributed' });
      } catch (e) {
        try { fs.unlinkSync(file.path); } catch {}
        return safeRespond(400, { message: 'Invalid Excel file' });
      }
    } else {
      try { fs.unlinkSync(file.path); } catch {}
      return safeRespond(400, { message: 'Unsupported file format' });
    }
  } catch (err) {
    try { if (file?.path) fs.unlinkSync(file.path); } catch {}
    return safeRespond(500, { message: 'Server error' });
  }
});

/**
 * GET /api/tasks
 * Auth: Bearer token (admin)
 * Returns all tasks with populated agent basic info.
 */
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find().populate('agent', 'name email phone');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// distribution logic moved to services/taskService.js

module.exports = router;
