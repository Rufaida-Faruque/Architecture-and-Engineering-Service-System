import { useState } from 'react';
import axios from 'axios';

const CreateRepository = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    industrySector: '',
    projectType: '',
    tags: [],
    clients: [],
    collaborators: [],
    date: { start: '', end: '' },
    view: 'private',
    documents: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/repositories/create', formData);
      console.log('Repository created', response.data);
    } catch (error) {
      console.error('Error creating repository', error);
    }
  };

  return (
    <div>
      <h1>Create Repository</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
        />
        {/* Add fields for other attributes like sector, type, tags, collaborators, etc. */}
        <button type="submit">Create Repository</button>
      </form>
    </div>
  );
};

export default CreateRepository;
