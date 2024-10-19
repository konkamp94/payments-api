import { CustomBaseEntity } from './types/base-entity.type';

export interface CustomRepository<T extends CustomBaseEntity> {
    create(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    delete(id: number): Promise<void>;
    findAll(): Promise<T[]>;
    findById(id: number): Promise<T>;
}

export const CUSTOM_REPOSITORY = 'CUSTOM_REPOSITORY';