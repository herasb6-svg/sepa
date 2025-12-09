import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, Req } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoSimple } from './dto/create-empleado-simple.dto';
import * as express from 'express';
import { CreateRegistroAsistencia } from './dto/create-registro-asistencia.dto';
import { CreateRegistroProduccion } from './dto/create-registro-produccion.dto';

@Controller('empleados')
export class EmpleadosController {
    constructor(private readonly empleadosService: EmpleadosService) {}

    @Post()
    createEmpleado(@Body() data: CreateEmpleadoSimple) {
        return this.empleadosService.createEmpleado(data);
    }

    @Post("create-asistencia")
    asistencia(@Body() data: CreateRegistroAsistencia) {
        return this.empleadosService.createRegistroAsistencia(data);
    }

    @Post("create-produccion")
    produccion(@Body() data: CreateRegistroProduccion) {
        return this.empleadosService.createRegistroProduccion(data);
    }

    @Get("total-asistencias")
    //http://localhost:3000/api/dsm43/empleados/total-asistencias?id_empleado=1&fechaInicio=01/01/2025&fechaFin=01/01/2025
    async getAsistencias(
        @Query('id_empleado') id_empleado: number,
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.empleadosService.getAsistencias(id_empleado, fechaInicio, fechaFin);
    }

    @Get("nomina")
    async getNomina(
        @Query('id_empleado') id_empleado: number,
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.empleadosService.getNomina(id_empleado, fechaInicio, fechaFin);
    }

    @Get("dias-trabajados")
    async getDiasTrabajados(
        @Query('id_empleado') id_empleado: number,
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.empleadosService.getDiasTrabajados(id_empleado, fechaInicio, fechaFin);
    }

    @Get("reporte-asistencia")
    async getReporteAsistencia(
        @Query('id_empleado') id_empleado: number,
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.empleadosService.getReporteAsistencia(id_empleado, fechaInicio, fechaFin);
    }

    @Get("reporte-produccion")
    async getReporteProduccion(
        @Query('id_empleado') id_empleado: number,
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ) {
        return this.empleadosService.getReporteProduccion(id_empleado, fechaInicio, fechaFin);
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Req() req: express.Request
    ) {
        const baseUrl = `${req.protocol}://${req.host}${req.baseUrl}/api/dsm43/empleados`;

        return this.empleadosService.findAllEmpleado(Number(page), Number(limit), baseUrl);
    }

    @Get(':id_empleado')
    findOne(@Param('id_empleado') id_empleado: number) {
        return this.empleadosService.findOneEmpleado(id_empleado);
    }

    
    @Delete(':id_empleado')
    remove(@Param('id_empleado') id_empleado: number) {
        return this.empleadosService.removeEmpleado(id_empleado);
    }

    @Post("entrada/:id_empleado")
    createAistenciaEntrada(@Param("id_empleado") id_empleado: number){
        return this.createAistenciaEntrada(id_empleado);
    }

    @Patch("salida/:id_empleado")
    updateAistenciaSalida(@Param("id_empleado") id_empleado: number){
        return this.updateAistenciaSalida(id_empleado);
    }

    @Post("produccion/:id_empleado/:unidadesProducidas")
    createProduccion(@Param("id_empleado") id_empleado: number, @Param("unidadesProducidas") unidadesProducidas: number){
        return this.createProduccion(id_empleado, unidadesProducidas);
    }

}
