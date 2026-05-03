import { jest } from '@jest/globals';
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../../controllers/productos.controller.js';
import Producto from '../../models/Producto.js';

describe('Productos Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      json: jest.fn()
    };
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('obtenerProductos', () => {
    it('debería obtener todos los productos', async () => {
      const mockProducts = [{ name: 'Producto 1' }, { name: 'Producto 2' }];
      jest.spyOn(Producto, 'find').mockResolvedValue(mockProducts);

      await obtenerProductos(req, res);

      expect(Producto.find).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });
  });

  describe('crearProducto', () => {
    it('debería crear un nuevo producto', async () => {
      req.body = { nombre: 'Nuevo Producto', precio: 100 };
      const mockSavedProduct = { ...req.body, _id: '123' };
      jest.spyOn(Producto.prototype, 'save').mockResolvedValue(mockSavedProduct);

      await crearProducto(req, res);

      expect(Producto.prototype.save).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        nombre: 'Nuevo Producto',
        precio: 100
      }));
    });
  });

  describe('actualizarProducto', () => {
    it('debería actualizar un producto existente', async () => {
      req.params.id = '123';
      req.body = { nombre: 'Producto Actualizado' };
      const mockUpdatedProduct = { ...req.body, _id: '123' };

      jest.spyOn(Producto, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedProduct);

      await actualizarProducto(req, res);

      expect(Producto.findByIdAndUpdate).toHaveBeenCalledWith('123', req.body, { new: true });
      expect(res.json).toHaveBeenCalledWith(mockUpdatedProduct);
    });
  });

  describe('eliminarProducto', () => {
    it('debería eliminar un producto', async () => {
      req.params.id = '123';

      jest.spyOn(Producto, 'findByIdAndDelete').mockResolvedValue({});

      await eliminarProducto(req, res);

      expect(Producto.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Producto eliminado' });
    });
  });
});
