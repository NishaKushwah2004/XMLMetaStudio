import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage directory
const STORAGE_DIR = path.join(__dirname, '../storage');

// Ensure storage directory exists
fs.ensureDirSync(STORAGE_DIR);

export const saveXMLFile = async (req, res) => {
  try {
    console.log('Save request received:', req.body);
    
    const { filename, content } = req.body;

    if (!filename || !content) {
      console.error('Missing filename or content');
      return res.status(400).json({ 
        error: 'Filename and content are required',
        received: { filename: !!filename, content: !!content }
      });
    }

    // Sanitize filename - ensure it ends with .xml
    let sanitizedFilename = filename.replace(/[^a-z0-9._-]/gi, '_');
    if (!sanitizedFilename.endsWith('.xml')) {
      sanitizedFilename += '.xml';
    }
    
    const filePath = path.join(STORAGE_DIR, sanitizedFilename);
    console.log('Saving to:', filePath);

    // Validate XML
    try {
      const parser = new xml2js.Parser();
      await parser.parseStringPromise(content);
      console.log('XML validation successful');
    } catch (xmlError) {
      console.error('XML validation failed:', xmlError.message);
      return res.status(400).json({ 
        error: 'Invalid XML format', 
        message: xmlError.message 
      });
    }

    // Save file
    await fs.writeFile(filePath, content, 'utf8');
    console.log('File saved successfully');

    res.json({ 
      success: true, 
      message: 'File saved successfully',
      filename: sanitizedFilename,
      path: filePath
    });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ 
      error: 'Failed to save file', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Load XML file
export const loadXMLFile = async (req, res) => {
  try {
    const { filename } = req.params;
    console.log('Load request for:', filename);

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const filePath = path.join(STORAGE_DIR, filename);
    console.log('Loading from:', filePath);

    // Check if file exists
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      console.error('File not found:', filePath);
      return res.status(404).json({ error: 'File not found' });
    }

    // Read file
    const content = await fs.readFile(filePath, 'utf8');
    console.log('File loaded successfully');

    res.json({ 
      success: true, 
      content,
      filename 
    });
  } catch (error) {
    console.error('Error loading file:', error);
    res.status(500).json({ 
      error: 'Failed to load file', 
      message: error.message 
    });
  }
};

// Delete XML file
export const deleteXMLFile = async (req, res) => {
  try {
    const { filename } = req.params;
    console.log('Delete request for:', filename);

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const filePath = path.join(STORAGE_DIR, filename);

    // Check if file exists
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete file
    await fs.remove(filePath);
    console.log('File deleted successfully');

    res.json({ 
      success: true, 
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      error: 'Failed to delete file', 
      message: error.message 
    });
  }
};

// List all XML files
export const listXMLFiles = async (req, res) => {
  try {
    console.log('Listing files from:', STORAGE_DIR);
    
    // Ensure directory exists
    await fs.ensureDir(STORAGE_DIR);
    
    const files = await fs.readdir(STORAGE_DIR);
    const xmlFiles = files.filter(file => file.endsWith('.xml'));
    
    console.log('Found files:', xmlFiles);

    res.json({ 
      success: true, 
      files: xmlFiles,
      count: xmlFiles.length,
      storage: STORAGE_DIR
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ 
      error: 'Failed to list files', 
      message: error.message 
    });
  }
};

// Parse XML string
export const parseXMLString = async (req, res) => {
  try {
    const { xml } = req.body;

    if (!xml) {
      return res.status(400).json({ error: 'XML content is required' });
    }

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    res.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('Error parsing XML:', error);
    res.status(400).json({ 
      error: 'Invalid XML format', 
      message: error.message 
    });
  }
};

// Validate XML
export const validateXML = async (req, res) => {
  try {
    const { xml } = req.body;

    if (!xml) {
      return res.status(400).json({ error: 'XML content is required' });
    }

    const parser = new xml2js.Parser();
    await parser.parseStringPromise(xml);

    res.json({ 
      success: true, 
      valid: true,
      message: 'XML is valid' 
    });
  } catch (error) {
    res.json({ 
      success: false, 
      valid: false,
      message: 'XML is invalid',
      error: error.message 
    });
  }
};