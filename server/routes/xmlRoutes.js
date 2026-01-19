// -------------------- backend/routes/xmlRoutes.js --------------------
import express from 'express';
import {
  saveXMLFile,
  loadXMLFile,
  deleteXMLFile,
  listXMLFiles,
  parseXMLString,
  validateXML
} from '../controller/xmlController.js';

const router = express.Router();

// Save XML file
router.post('/save', saveXMLFile);

// Load XML file
router.get('/load/:filename', loadXMLFile);

// Delete XML file
router.delete('/delete/:filename', deleteXMLFile);

// List all XML files
router.get('/files', listXMLFiles);

// Parse XML string
router.post('/parse', parseXMLString);

// Validate XML
router.post('/validate', validateXML);

export default router;