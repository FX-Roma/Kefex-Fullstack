
import Producto from "../Models/Product.model.js";

// CREATE: Crear nuevo producto
export const crearProducto = async (req, res) => {
  try {
<<<<<<< HEAD
    const datos = { ...req.body };

    // Guardar la ruta de la imagen recibida por Multer
    if (req.file) {
      datos.imagen = `/uploads/${req.file.filename}`;
    }

    const nuevoProducto = new Producto(datos);
=======
    const {
      nombre,
      descripcion,
      precio,
      categoria,
      stock,
      valoracion
    } = req.body;

    if (!nombre || !descripcion || !precio || !categoria) {
      return res.status(400).json({
        mensaje: "Completa los campos obligatorios."
      });
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio: Number(precio),
      categoria,
      imagen: req.file
        ? `/uploads/${req.file.filename}`
        : "",
      stock: Number(stock ?? 0),
      valoracion: Number(valoracion ?? 0)
    });

>>>>>>> origin/main
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

// READ BY ID
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
<<<<<<< HEAD
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
=======
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
>>>>>>> origin/main
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

<<<<<<< HEAD
=======
    const {
      nombre,
      descripcion,
      precio,
      categoria,
      stock,
      valoracion
    } = req.body;

    if (nombre !== undefined) producto.nombre = nombre;
    if (descripcion !== undefined) producto.descripcion = descripcion;
    if (precio !== undefined) producto.precio = Number(precio);
    if (categoria !== undefined) producto.categoria = categoria;
    if (stock !== undefined) producto.stock = Number(stock);
    if (valoracion !== undefined) producto.valoracion = Number(valoracion);

    // Si se selecciona una imagen nueva, reemplaza la anterior.
    // Si no se selecciona, conserva la imagen existente.
    if (req.file) {
      producto.imagen = `/uploads/${req.file.filename}`;
    }

    const productoActualizado = await producto.save();

>>>>>>> origin/main
    res.status(200).json(productoActualizado);

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar producto",
      error: error.message
    });
  }
};

// DELETE: Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
<<<<<<< HEAD
    const productoEliminado = await Producto.findByIdAndDelete(
      req.params.id
    );

    if (!productoEliminado) {
=======
    const producto = await Producto.findByIdAndDelete(req.params.id);

    if (!producto) {
>>>>>>> origin/main
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Producto eliminado correctamente"
    });
<<<<<<< HEAD
=======

>>>>>>> origin/main
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar producto",
      error: error.message
    });
  }
};
