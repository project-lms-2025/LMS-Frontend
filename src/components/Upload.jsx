import React, { useState } from 'react';

const uploadImageToS3 = async (imageFile, testId, type, id) => {
  try {
    const fileType = imageFile.type.split('/')[1];
    let imageName = '';

    if (type === 'option') {
      imageName = `${testId}/options/${id}.${fileType}`;
    } else if (type === 'question') {
      imageName = `${testId}/questions/${id}.${fileType}`;
    } else {
      throw new Error('Invalid image type');
    }

    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/generatePresignedUrl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: imageName,
        fileType: imageFile.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Error generating presigned URL');
    }

    const { presignedUrl } = await response.json();

    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': imageFile.type,
      },
      body: imageFile,
    });

    if (!uploadResponse.ok) {
      throw new Error('Error uploading image to S3');
    }

    alert('Image uploaded successfully!');
    return true;
  } catch (error) {
    console.error('Error during image upload:', error);
    alert('Error uploading image!');
    return false;
  }
};

const FileUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [testId, setTestId] = useState('');
  const [type, setType] = useState('question');
  const [id, setId] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !testId || !id) {
      alert('Please provide all the necessary inputs');
      return;
    }

    const success = await uploadImageToS3(file, testId, type, id);
    if (success) {
      setFile(null);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Test ID"
        value={testId}
        onChange={(e) => setTestId(e.target.value)}
      />
      <input
        type="text"
        placeholder="ID (e.g., question or option ID)"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="question">Question</option>
        <option value="option">Option</option>
      </select>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Upload Image</button>
    </div>
  );
};

export default FileUploadComponent;