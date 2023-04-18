import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Data{
    @PrimaryColumn()
    vin: String;
    
    @PrimaryColumn()
    datapoint: String;

    @PrimaryColumn()
    timestamp: String;

    @Column()
    value: String;

    @Column({nullable: false})
    secondValue: String
}