import { type } from 'os';
import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Data{
    @PrimaryColumn()
    vin: String;
    
    @PrimaryColumn()
    datapoint: String;

    @Column()
    timestamp: String;

    @Column({type: 'json'})
    value: any;

    @Column({type: 'json'})
    secondValue: String

    @Column()
    unit: String
}