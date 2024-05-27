import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/user.guard';

@Controller('reviews')
@ApiBearerAuth("access-token")
@ApiTags("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createReviewDto: CreateReviewDto,@Req()req:any) {
    return this.reviewsService.create(createReviewDto,req.user.id);
  }

  // @Get()
  // findAll() {
  //   return this.reviewsService.findAll();
  // }

  @Get(':Productid')
  findOne(@Param('Productid',ParseIntPipe) Productid: number) {
    return this.reviewsService.getProductReviews(Productid);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
  //   return this.reviewsService.update(+id, updateReviewDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reviewsService.remove(+id);
  // }
}
