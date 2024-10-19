import { CustomRepository } from "../custom-repository.interface";
import { Repository } from "typeorm";
import { Inject } from "@nestjs/common";
import { CustomBaseEntity } from "../types/base-entity.type";

export class TypeOrmRepository<T extends CustomBaseEntity> implements CustomRepository<T> {
    constructor(
        @Inject('REPOSITORY')
        private repository: Repository<T>,
    ) { }

    async create(entity: T): Promise<T> {
        return this.repository.save(entity);
    }

    async update(entity: T): Promise<T> {
        return this.repository.save(entity);
    }

    async delete(id: number): Promise<void> {
        this.repository.delete(id);
    }

    async findAll(): Promise<T[]> {
        return this.repository.find();
    }

    async findById(id: number): Promise<T> {
        return this.repository.findOneBy({ id } as any);
    }
}