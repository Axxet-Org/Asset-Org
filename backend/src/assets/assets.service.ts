import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { CreateAssetDto, UpdateAssetDto } from './asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
  ) {}

  findAll(): Promise<Asset[]> {
    return this.assetRepo.find();
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.assetRepo.findOneBy({ id });
    if (!asset) throw new NotFoundException(`Asset ${id} not found`);
    return asset;
  }

  create(dto: CreateAssetDto): Promise<Asset> {
    return this.assetRepo.save(this.assetRepo.create(dto));
  }

  async update(id: string, dto: UpdateAssetDto): Promise<Asset> {
    await this.findOne(id);
    await this.assetRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.assetRepo.delete(id);
  }
}
