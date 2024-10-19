import { CustomRepository } from "../custom-repository.interface";
import { CustomBaseEntity } from "../types/base-entity.type";

export class InMemoryRepository<T extends CustomBaseEntity> implements CustomRepository<T> {
    private entities: T[] = [];

    async create(entity: T): Promise<T> {
        this.entities.push(entity);
        return entity;
    }

    async update(entity: T): Promise<T> {
        const index = this.entities.findIndex((e) => e === entity);
        this.entities[index] = entity;
        return entity;
    }

    async delete(id: number): Promise<void> {
        this.entities = this.entities.filter((e) => e.id !== id);
    }

    async findAll(): Promise<T[]> {
        return this.entities;
    }

    async findById(id: number): Promise<T> {
        return this.entities.find((e) => e.id === id);
    }
}