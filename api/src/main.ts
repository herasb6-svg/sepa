import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'body-parser';
import { networkInterfaces } from 'os';
import { ValidationPipe } from '@nestjs/common';

const getLocalIp = () =>
  Object.values(networkInterfaces())
    .flat()
    .find(i => i?.family === 'IPv4' && !i.internal)?.address || 'localhost';

const capibara = async() => {
    const app = await NestFactory.create(AppModule);
    // Configuración CORS mejorada
    app.enableCors({
        origin: ['http://localhost:8081', 'http://192.168.100.10:8081', 'exp://192.168.100.10:8081'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204
    });
    app.use(json({limit: "300mb"}));
    app.use(urlencoded({limit: "300mb", extended: true}));
    app.setGlobalPrefix("api/dsm43");
    
    // Agregar ValidationPipe global
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );
    
    await app.listen(3000);
    console.log(`API: http://${getLocalIp()}:3000`);
}
capibara();
