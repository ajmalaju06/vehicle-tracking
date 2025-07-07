"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let SimulationService = class SimulationService {
    constructor() {
        this.vehicles = {};
        this.vehicleTimers = {};
        this.currentIndices = {};
    }
    onModuleInit() {
        this.loadVehicleData();
        this.startSimulation();
    }
    onModuleDestroy() {
        this.stopSimulation();
    }
    setServer(server) {
        this.server = server;
    }
    isValidPlate(plate) {
        return plate in this.vehicles;
    }
    getVehicles() {
        return Object.keys(this.vehicles);
    }
    loadVehicleData() {
        const vehiclePlateNumbers = [
            "DXB-AX-36352",
            "DXB-BX-36355",
            "DXB-CX-36357",
            "DXB-CX-36358",
            "DXB-DX-36353",
            "DXB-DX-36357",
            "DXB-DX-36359",
            "DXB-IX-36356",
            "DXB-IX-36360",
            "DXB-XX-36353",
        ];
        vehiclePlateNumbers.forEach((plate) => {
            const filePath = (0, path_1.join)(process.cwd(), "src", "data", `${plate}.json`);
            if ((0, fs_1.existsSync)(filePath)) {
                try {
                    const data = (0, fs_1.readFileSync)(filePath, "utf-8");
                    this.vehicles[plate] = JSON.parse(data);
                    this.currentIndices[plate] = 0;
                    console.log(`Loaded data for vehicle ${plate}`);
                }
                catch (error) {
                    console.error(`Error loading data for vehicle ${plate}:`, error);
                }
            }
            else {
                console.warn(`Data file for vehicle ${plate} does not exist.`);
            }
        });
    }
    startSimulation() {
        Object.keys(this.vehicles).forEach((plate) => {
            this.vehicleTimers[plate] = setInterval(() => {
                this.emitNextDataPoint(plate);
            }, 1000);
        });
        console.log("Simulation started for all vehicles.");
    }
    stopSimulation() {
        Object.values(this.vehicleTimers).forEach((timer) => clearInterval(timer));
        console.log("Simulation stopped.");
    }
    emitNextDataPoint(plate) {
        const vehicleData = this.vehicles[plate];
        if (!vehicleData)
            return;
        let currentIndex = this.currentIndices[plate];
        if (currentIndex >= vehicleData.length) {
            this.currentIndices[plate] = 0;
            currentIndex = 0;
        }
        const dataPoint = vehicleData[currentIndex];
        this.server.to(plate).emit("vehicleData", { plate, data: dataPoint });
        this.currentIndices[plate] += 1;
    }
};
exports.SimulationService = SimulationService;
exports.SimulationService = SimulationService = __decorate([
    (0, common_1.Injectable)()
], SimulationService);
//# sourceMappingURL=simulation.service.js.map