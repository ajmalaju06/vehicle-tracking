"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const simulation_service_1 = require("./simulation.service");
let EventsGateway = class EventsGateway {
    constructor(simulationService) {
        this.simulationService = simulationService;
    }
    afterInit(server) {
        this.simulationService.setServer(server);
        console.log("WebSocket server initialized");
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleGetVehicles(client) {
        const vehicles = this.simulationService.getVehicles();
        client.emit("vehiclesList", vehicles);
        console.log(`Sent vehicle data to client ${client.id}`);
    }
    handleSubscribeToVehicle(data, client) {
        const { plate } = data;
        console.log(`Client ${client.id} requested to subscribe to vehicle ${plate}`);
        if (this.simulationService.isValidPlate(plate)) {
            client.join(plate);
            client.emit("subscribed", { plate });
            console.log(`Client ${client.id} subscribed to vehicle ${plate}`);
        }
        else {
            client.emit("error", { message: `Invalid plate number: ${plate}` });
            console.warn(`Client ${client.id} attempted to subscribe to invalid plate ${plate}`);
        }
    }
    handleUnsubscribeFromVehicle(data, client) {
        const { plate } = data;
        client.leave(plate);
        client.emit("unsubscribed", { plate });
        console.log(`Client ${client.id} unsubscribed from vehicle ${plate}`);
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("getVehicles"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleGetVehicles", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("subscribeToVehicle"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleSubscribeToVehicle", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("unsubscribeFromVehicle"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleUnsubscribeFromVehicle", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    }),
    __metadata("design:paramtypes", [simulation_service_1.SimulationService])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map