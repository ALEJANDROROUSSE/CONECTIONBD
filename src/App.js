import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Archivo para tus estilos personalizados

const App = () => {
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    apellidoPaterno: '',
    telefono: '',
    correo: ''
  });

  const [registros, setRegistros] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Cargar registros desde el backend al iniciar
  useEffect(() => {
    const fetchRegistros = async () => {
      const response = await fetch('http://localhost:5000/api/estudiantes'); // Cambiado a puerto 5001
      const data = await response.json();
      setRegistros(data);
    };
    fetchRegistros();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedRegistros = registros.map((registro, index) =>
        index === editingIndex ? formData : registro
      );
      setRegistros(updatedRegistros);
      setEditingIndex(null);
    } else {
      // Enviar datos al backend
      const response = await fetch('http://localhost:5001/api/estudiantes', { // Cambiado a puerto 5001
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setRegistros([...registros, data]);
    }
    setFormData({
      documento: '',
      nombre: '',
      apellidoPaterno: '',
      telefono: '',
      correo: ''
    });
  };

  const handleEdit = (index) => {
    setFormData(registros[index]);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    const id = registros[index].id; // Suponiendo que el backend retorna el id del registro
    await fetch(`http://localhost:5001/api/estudiantes/${id}`, { // Cambiado a puerto 5001
      method: 'DELETE',
    });
    const updatedRegistros = registros.filter((_, i) => i !== index);
    setRegistros(updatedRegistros);
  };

  return (
    <div className="container my-5 p-4">
      <div className="bg-light p-5 rounded shadow-lg form-container">
        <h2 className="mb-4 text-primary text-center">Registro de Estudiantes</h2>
        <div className="row">
          {/* Formulario */}
          <div className="col-md-6">
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
              <div className="form-group mb-3">
                <label className="form-label">Documento</label>
                <input
                  type="text"
                  className="form-control"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Apellido Paterno</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3 w-100">
                {editingIndex !== null ? 'Actualizar' : 'Registrar'}
              </button>
            </form>
          </div>

          {/* Tabla de Registros */}
          <div className="col-md-6">
            <table className="table table-striped table-bordered shadow-sm bg-white mt-4">
              <thead className="table-primary">
                <tr>
                  <th>Documento</th>
                  <th>Nombre</th>
                  <th>Apellido Paterno</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro, index) => (
                  <tr key={index}>
                    <td>{registro.documento}</td>
                    <td>{registro.nombre}</td>
                    <td>{registro.apellidoPaterno}</td>
                    <td>{registro.telefono}</td>
                    <td>{registro.correo}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(index)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(index)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
