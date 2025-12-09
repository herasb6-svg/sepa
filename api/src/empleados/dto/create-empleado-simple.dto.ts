import { 
    IsString,
    MaxLength,
    MinLength,
    IsOptional,
    IsEnum,
    IsBoolean,
    IsPositive,
    IsNumber
} from "class-validator";
import { Area } from "../enum/area.enum";
import { Turno } from "../enum/turno.enum";

export class CreateEmpleadoSimple {
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    nombre:         string;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    apellido_p:     string;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    apellido_m:     string;
   
    @IsEnum( Area )
    @IsOptional()
    area:           Area;

    @IsEnum( Turno )
    @IsOptional()
    turno:          Turno;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    salarioDiario:  number;

    @IsBoolean()
    @IsOptional()
    activo:         boolean;
}
