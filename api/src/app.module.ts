import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { SensorModule } from './sensor/sensor.module';
//import { MongooseModule } from '@nestjs/mongoose';
import { Empleado } from './empleados/entities/empleado.entity';
import { RegistroAsistencia } from './empleados/entities/registro-asistencia.entity';
import { RegistroProduccion } from './empleados/entities/registro-produccion.entity';
import { EmpleadosModule } from './empleados/empleados.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        name: "conexion-postgres",
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "papoionopapoi",
        password: "pass",
        database: "empresa",
        entities: [ RegistroAsistencia, RegistroProduccion, Empleado ],
        synchronize: true,
        autoLoadEntities: true,
    }),
    EmpleadosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
