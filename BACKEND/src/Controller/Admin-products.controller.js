
import Producto from "../Models/Product.model.js";

// CREATE: Crear nuevo producto
export const crearProducto = async (req, res) => {
  try {
    const datos = { ...req.body };

    // Guardar la ruta de la imagen recibida por Multer
    if (req.file) {
      datos.imagen = `/uploads/${req.file.filename}`;
    }

    const nuevoProducto = new Producto(datos);
    const productoGuardado = await nuevoProducto.save();

    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear el producto",
      error: error.message
    });
  }
};

// READ: Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener productos",
      error: error.message
    });
  }
};

// READ BY ID: Obtener producto por su ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar producto",
      error: error.message
    });
  }
};

// UPDATE: Actualizar producto existente
export const actualizarProducto = async (req, res) => {
  try {
    const datos = { ...req.body };

    // Si se seleccionó una imagen nueva, actualizar su ruta
    if (req.file) {
      datos.imagen = `/uploads/${req.file.filename}`;
    }

    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      datos,
      {
        new: true,
        runValidators: true
      }
    );

    if (!productoActualizado) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar producto",
      error: error.message
    });
  }
};

// DELETE: Eliminar un producto
export const eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(
      req.params.id
    );

    if (!productoEliminado) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Producto eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar producto",
      error: error.message
    });
  }
};
