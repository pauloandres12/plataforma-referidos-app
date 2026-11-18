CREATE DATABASE IF NOT EXISTS plataforma_referidos
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE plataforma_referidos;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  identificacion VARCHAR(20) NOT NULL UNIQUE,
  correo VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(20),
  producto_interes ENUM('ahorro', 'credito', 'inversion') NULL,
  contrasena_hash VARCHAR(255) NOT NULL,
  foto VARCHAR(255),
  perfil_privado BOOLEAN NOT NULL DEFAULT FALSE,
  rol ENUM('socio', 'administrador', 'gestor') NOT NULL DEFAULT 'socio',
  estado ENUM('pendiente', 'activa', 'inactiva') NOT NULL DEFAULT 'pendiente',
  codigo_referido VARCHAR(20) UNIQUE,
  referido_por INT NULL,
  acepto_politica BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_referido_por
    FOREIGN KEY (referido_por) REFERENCES usuarios(id) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;