import { PrismaClient, SeverityLevel } from "@prisma/client";
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";


const prismaClient = new PrismaClient();

const serverityEnum = {
    low: SeverityLevel.LOW,
    medium: SeverityLevel.MEDIUM,
    high: SeverityLevel.HIGH,
}

export class PostgresLogDatasource implements LogDatasource {
    
    async saveLog(log: LogEntity): Promise<void> {
        
        const level = serverityEnum[log.level];

        const newLog = await prismaClient.logModel.create({
            data: {
                ...log,
                level: level,
            }
        });

        console.log('Postgres saved');
    }
    
    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {

        const level = serverityEnum[severityLevel];
        const dbLogs = await prismaClient.logModel.findMany({
            where: {
                level: level
            }
        });

        return dbLogs.map(dbLog => LogEntity.fromObject(dbLog));
    }
    

    private getSeverityLog = (level: string): string => {

        switch(level){
            case LogSeverityLevel.low: return "LOW";
            case LogSeverityLevel.medium: return "MEDIUM";
            case LogSeverityLevel.high: return "HIGH";
            default: return "LOW";
        }
    }

}