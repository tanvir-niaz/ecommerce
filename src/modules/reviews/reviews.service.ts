import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ReviewsService {

  constructor(@InjectRepository(Product) private productRepository:Repository<Product>,@InjectRepository(User) private readonly userRepository: Repository<User>,
  @InjectRepository(Review) private reviewRepository:Repository<Review> 
){}
  async create(createReviewDto: CreateReviewDto,userId:number) {
    const product=await this.productRepository.findOne({where:{id:createReviewDto.product_id}});
    const user=await this.userRepository.findOne({where:{id:userId}});
    if(!product){
      return{
        statusCode:HttpStatus.NOT_FOUND,
        error:null,
        message:"No product found by that id"
      }
    }
    const review=new Review();
    review.rating=createReviewDto.ratings;
    review.review=createReviewDto.review;
    review.product=product;
    review.user=user;
    await this.reviewRepository.save(review);
    
    return{
      statusCode:HttpStatus.CREATED,
      error:null,
      message:"Review has been added to product ${product.name}"
    }

  }

  findAll() {
    return `This action returns all reviews`;
  }

  async getProductReviews(productId: number): Promise<any> {
    const reviews = await this.reviewRepository.find({ 
        where: { product: { id: productId } },
        relations: ['user']
    });
    if(reviews.length==0){
      return {
        statusCode:HttpStatus.OK,
        error:null,
        message:"No product review found"
      }
    }

    return reviews.map(review => ({
        id: review.id,
        review: review.review,
        review_at: review.review_at,
        rating: review.rating,
        user: {
            id: review.user.id,
            name: review.user.name
        },
        // product: {
        //     id: review.product.id,
        //     name: review.product.name,
        //     description: review.product.description,
        //     price: review.product.price,
        //     discount: review.product.discount,
        //     discountPrice: review.product.discountPrice,
        //     stockQuantity: review.product.stockQuantity,
        //     category: review.product.category
        // }
    }));
}


  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
