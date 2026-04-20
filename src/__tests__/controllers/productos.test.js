const {  obtenerProductos,  crearProducto,  actualizarProducto,  eliminarProducto} = require('../../controllers/productos.controller'); 

const {describe, expect, test} = require('@jest/globals');

// tests/unit/producto.test.js
jest.mock('../../models/Producto');
const Producto = require('../../models/Producto');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('productoController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obtenerProductos', () => {
    test('responde con la lista de productos desde Producto.find', async () => {
      const productosMock = [{ nombre: 'A' }, { nombre: 'B' }];
      Producto.find.mockResolvedValue(productosMock);

      const req = {};
      const res = mockResponse();

      await obtenerProductos(req, res);

      expect(Producto.find).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(productosMock);
    });
  });

  describe('crearProducto', () => {
    test('crea y guarda un nuevo producto y responde con él', async () => {
      const body = { nombre: 'Nuevo', precio: 10 };
      // Simular constructor: new Producto(req.body) debe devolver instancia con save
      const saveMock = jest.fn().mockResolvedValue();
      // Producto mock como función constructora
      Producto.mockImplementation(function (data) {
        Object.assign(this, data);
        this.save = saveMock;
      });

      const req = { body };
      const res = mockResponse();

      await crearProducto(req, res);

      expect(Producto).toHaveBeenCalledWith(body); // constructor llamado
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(body));
    });
  });

  describe('actualizarProducto', () => {
    test('actualiza producto por id y responde con el actualizado', async () => {
      const id = 'abc123';
      const body = { nombre: 'Editado' };
      const actualizadoMock = { id, ...body };

      Producto.findByIdAndUpdate.mockResolvedValue(actualizadoMock);

      const req = { params: { id }, body };
      const res = mockResponse();

      await actualizarProducto(req, res);

      expect(Producto.findByIdAndUpdate).toHaveBeenCalledWith(id, body, { new: true });
      expect(res.json).toHaveBeenCalledWith(actualizadoMock);
    });
  });

  describe('eliminarProducto', () => {
    test('elimina producto por id y responde con mensaje', async () => {
      const id = '0';
      Producto.findByIdAndDelete.mockResolvedValue();

      const req = { params: { id } };
      const res = mockResponse();

      await eliminarProducto(req, res);

      expect(Producto.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Producto eliminado' });
    });
  });
});
