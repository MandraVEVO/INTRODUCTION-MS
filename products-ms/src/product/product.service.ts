import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '../../generated/prisma';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class ProductService extends PrismaClient implements OnModuleInit{

  private readonly logger = new Logger('ProductService');

  onModuleInit() {
      this.$connect();
      this.logger.log('DB connected');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

 async findAll( paginationDto: PaginationDto ) {

  const { page = 1, limit = 10 } = paginationDto;  

  const totalItems = await this.product.count();

  const lastPage = Math.ceil(totalItems / limit);

  return {
      data: await this.product.findMany({
        skip: ( page - 1 ) * limit,
        take: limit
      }),
      meta: {
        total: totalItems,
        page: page,
        lastPage: lastPage,
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id }
    });
    

    if ( !product ) {
      return {
        message: `Product with id ${id} not found`
      }
    }

    return product;
  }

   async update(id: number, updateProductDto: UpdateProductDto) {

    const existingProduct = await this.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return {
        message: `Product with id ${id} not found, cannot update`
      };
    }

    return this.product.update({
      where: { id },
      data: updateProductDto,
    });

  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
