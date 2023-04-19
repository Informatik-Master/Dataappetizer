import { Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vehicles{
    @PrimaryColumn()
    vin: String;
}