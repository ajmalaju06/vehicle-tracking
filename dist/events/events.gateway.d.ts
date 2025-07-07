import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SimulationService } from "./simulation.service";
export declare class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly simulationService;
    server: Server;
    constructor(simulationService: SimulationService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleGetVehicles(client: Socket): void;
    handleSubscribeToVehicle(data: {
        plate: string;
    }, client: Socket): void;
    handleUnsubscribeFromVehicle(data: {
        plate: string;
    }, client: Socket): void;
}
