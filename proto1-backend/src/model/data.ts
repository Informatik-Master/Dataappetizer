import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Data{
    @PrimaryColumn()
    vin: String;
    
    @PrimaryColumn()
    datapoint: String;

    @Column()
    timestamp: String;

    @Column()
    value: String;

    @Column({nullable: false})
    secondValue: String
}