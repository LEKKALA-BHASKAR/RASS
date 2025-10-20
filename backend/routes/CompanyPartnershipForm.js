import express from 'express';
import CompanyForm from '../models/CompanyPartnershipForm.js';
import fetch from 'node-fetch';

const router = express.Router();

// POST: Create a new partnership form with CAPTCHA verification
router.post('/', async (req, res) => {
  try {
    const { ...formData } = req.body;

    const form = new CompanyForm(formData);
    await form.save();

    res.status(201).json({ success: true, data: form });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET: fetch all submitted forms
router.get('/', async (req, res) => {
  try {
    const forms = await CompanyForm.find();
    res.status(200).json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
