<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AlumnoController;
use App\Http\Controllers\AdminBController;

// Vista HOME: Menú principal que verán todos al iniciar sesión
Route::get('/home', [HomeController::class, 'index'])
    ->middleware(['auth'])
    ->name('home');

// Grupo de rutas protegidas para el rol de ALUMNOS
Route::middleware(['auth', 'role:alumno'])->group(function () {
    // Rutas para las inscripciones y reinscripciones del estudiante
    Route::get('/alumno/inscripcion', [AlumnoController::class, 'inscripcion'])->name('alumno.inscripcion');
    
    // Ruta para que el alumno pueda registrar sus pagos
    Route::post('/alumno/pagos', [AlumnoController::class, 'registrarPago'])->name('alumno.pagos.registrar');
    
    // Ruta para que el alumno evalúe a sus profesores
    Route::get('/alumno/evaluacion-docente', [AlumnoController::class, 'evaluarProfesor'])->name('alumno.evaluacion');
});

// Grupo de rutas protegidas para ADMINISTRATIVOS NIVEL B
Route::middleware(['auth', 'role:admin_b'])->group(function () {
    // CRUD de Pagos (Los administrativos de nivel B controlan los registros de ingresos)
    Route::resource('/admin-b/pagos', AdminBController::class)->names('admin.pagos');
    
    // CRUD de Becas (Asignación, creación y control de alumnos becados)
    Route::get('/admin-b/becas', [AdminBController::class, 'indexBecas'])->name('admin.becas.index');
    Route::post('/admin-b/becas/guardar', [AdminBController::class, 'storeBeca'])->name('admin.becas.store');
    
    // Seguimiento del proceso de Titulación de los egresados
    Route::get('/admin-b/titulacion', [AdminBController::class, 'titulacion'])->name('admin.titulacion');
});
