import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result';
@Injectable()
export abstract class AbstractService { // cannot be used anywhere, can only extended by other service
  protected constructor(
    // @InjectRepository(User)
    protected repository: Repository<any>
  ) {
  }

  async all(relations: any[] = []): Promise<any[]> {
    return this.repository.find({ relations });
  }

  async paginate(page: number = 1, relations: any[] = []): Promise<PaginatedResult> {
    const take = 10;
    const [data, total] =  await this.repository.findAndCount({
      take,
      skip: (page -1) * take,
      relations
    });
    return {
      data,
      // data: users.map((user) => {
      //   const { password, ...data } = user;
      //   return data;
      // }),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take)  
      }
    }
  }

  async create(data): Promise<any> {
    return this.repository.save(data);
  }

  async findOne(condition, relations: any[] = []): Promise<any> {
    return this.repository.findOne(condition, { relations });
  }

  async update(id: number, data): Promise<any> {
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<any> {
    return this.repository.delete(id);
  }
}
