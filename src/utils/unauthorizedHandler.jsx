// src/utils/unauthorizedHandler.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import UnauthorizedDialog from '../components/UnauthorizedDialog';

let dialogContainer = null;
let dialogRoot = null;

export const showUnauthorizedDialog = () => {
  // Only show one dialog at a time
  if (dialogContainer) return;
  
  // Clear auth token
  localStorage.removeItem('authToken');
  
  // Create container for dialog
  dialogContainer = document.createElement('div');
  document.body.appendChild(dialogContainer);
  
  // Create root and render dialog
  dialogRoot = createRoot(dialogContainer);
  dialogRoot.render(
    <UnauthorizedDialog
      isOpen={true} 
      onClose={() => {
        // Clean up when dialog is closed
        dialogRoot.unmount();
        document.body.removeChild(dialogContainer);
        dialogContainer = null;
        dialogRoot = null;
        
        // Navigate to landing page
        window.location.href = '/';
      }} 
    />
  );
};