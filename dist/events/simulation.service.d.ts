import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Server } from "socket.io";
export declare class SimulationService implements OnModuleInit, OnModuleDestroy {
    private server;
    private vehicles;
    private vehicleTimers;
    private currentIndices;
    onModuleInit(): void;
    onModuleDestroy(): void;
    setServer(server: Server): void;
    isValidPlate(plate: string): boolean;
    getVehicles(): string[];
    private loadVehicleData;
    private startSimulation;
    private stopSimulation;
    private emitNextDataPoint;
}
