import Carrito from "../Models/K-carrito.model.js";
import Producto from "../Models/E-productStoreModule.js";

const cargarCarrito = async (usuarioId) => {
  return Carrito.findOne({ usuario: usuarioId }).populate("productos.producto");
};

const recalcularCarrito = async (carrito) => {
  let total = 0;

  for (const item of carrito.productos) {
    const producto = await Producto.findById(item.producto?._id || item.producto);

    if (!producto) continue;

    if (item.cantidad > producto.stock) {
      throw new Error(`Stock insuficiente para ${producto.nombre}`);
    }

    item.subtotal = Number((producto.precio * item.cantidad).toFixed(2));
    total += item.subtotal;
  }

  carrito.total = Number(total.toFixed(2));
  await carrito.save();

  return carrito.populate("productos.producto");
};

export const obtenerCarrito = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId || req.user?.id;
    if (!usuarioId) return res.status(400).json({ mensaje: "Se requiere el usuario" });

    let carrito = await cargarCarrito(usuarioId);

    if (!carrito) {
      carrito = await Carrito.create({ usuario: usuarioId });
      carrito = await cargarCarrito(usuarioId);
    }

    return res.status(200).json(carrito);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener el carrito",
      error: error.message,
    });
  }
};

export const agregarAlCarrito = async (req, res) => {
  try {
    const { usuarioId, productoId, cantidad = 1 } = req.body;

    if (!usuarioId || !productoId) {
      return res.status(400).json({
        mensaje: "usuarioId y productoId son obligatorios",
      });
    }

    const cantidadNumerica = Number(cantidad);
    if (!Number.isInteger(cantidadNumerica) || cantidadNumerica < 1) {
      return res.status(400).json({ mensaje: "La cantidad debe ser un entero mayor a 0" });
    }

    const producto = await Producto.findById(productoId);
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

    let carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) carrito = new Carrito({ usuario: usuarioId, productos: [] });

    const item = carrito.productos.find(
      (item) => item.producto.toString() === productoId
    );

    const nuevaCantidad = (item?.cantidad || 0) + cantidadNumerica;

    if (nuevaCantidad > producto.stock) {
      return res.status(409).json({
        mensaje: "La cantidad solicitada supera el stock disponible",
        stockDisponible: producto.stock,
      });
    }

    if (item) {
      item.cantidad = nuevaCantidad;
      item.subtotal = Number((producto.precio * nuevaCantidad).toFixed(2));
    } else {
      carrito.productos.push({
        producto: producto._id,
        cantidad: cantidadNumerica,
        subtotal: Number((producto.precio * cantidadNumerica).toFixed(2)),
      });
    }

    carrito.total = Number(
      carrito.productos.reduce((sum, current) => sum + current.subtotal, 0).toFixed(2)
    );

    await carrito.save();

    return res.status(200).json({
      mensaje: "Producto agregado al carrito",
      carrito: await carrito.populate("productos.producto"),
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error al agregar al carrito",
      error: error.message,
    });
  }
};

export const actualizarCantidadCarrito = async (req, res) => {
  try {
    const { cantidad } = req.body;
    const cantidadNumerica = Number(cantidad);

    if (!Number.isInteger(cantidadNumerica) || cantidadNumerica < 1) {
      return res.status(400).json({ mensaje: "La cantidad debe ser un entero mayor a 0" });
    }

    const carrito = await Carrito.findOne({ usuario: req.params.usuarioId });
    if (!carrito) return res.status(404).json({ mensaje: "Carrito no encontrado" });

    const item = carrito.productos.id(req.params.itemId);
    if (!item) return res.status(404).json({ mensaje: "Ítem no encontrado en el carrito" });

    const producto = await Producto.findById(item.producto);
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

    if (cantidadNumerica > producto.stock) {
      return res.status(409).json({
        mensaje: "La cantidad supera el stock disponible",
        stockDisponible: producto.stock,
      });
    }

    item.cantidad = cantidadNumerica;
    item.subtotal = Number((producto.precio * cantidadNumerica).toFixed(2));

    carrito.total = Number(
      carrito.productos.reduce((sum, current) => sum + current.subtotal, 0).toFixed(2)
    );

    await carrito.save();

    return res.status(200).json({
      mensaje: "Cantidad actualizada",
      carrito: await carrito.populate("productos.producto"),
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error al actualizar la cantidad",
      error: error.message,
    });
  }
};

export const eliminarDelCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.params.usuarioId });
    if (!carrito) return res.status(404).json({ mensaje: "Carrito no encontrado" });

    const item = carrito.productos.id(req.params.itemId);
    if (!item) return res.status(404).json({ mensaje: "Ítem no encontrado en el carrito" });

    item.deleteOne();

    carrito.total = Number(
      carrito.productos.reduce((sum, current) => sum + current.subtotal, 0).toFixed(2)
    );

    await carrito.save();

    return res.status(200).json({
      mensaje: "Producto eliminado del carrito",
      carrito: await carrito.populate("productos.producto"),
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar del carrito",
      error: error.message,
    });
  }
};

export const vaciarCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.params.usuarioId });
    if (!carrito) return res.status(404).json({ mensaje: "Carrito no encontrado" });

    carrito.productos = [];
    carrito.total = 0;
    await carrito.save();

    return res.status(200).json({
      mensaje: "Carrito vaciado correctamente",
      carrito,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al vaciar el carrito",
      error: error.message,
    });
  }
};
