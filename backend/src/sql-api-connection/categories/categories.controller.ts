import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { CategoriesService } from './categories.service'; 
import { Category } from '../entities/categories.entity'; 
import { CreateCategoryDto } from './dto/create-category.dto'; 
import { UpdateCategoryDto } from './dto/update-category.dto'; 
import { CategoryNavDto } from './dto/category-navigator-dto'; // 🔑 DTO החדש והקל

// 🔑 חובה: הפעלת ה-Interceptor ברמת ה-Controller כדי לאפשר שימוש ב-DTOs ו-@Exclude
@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor) 
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {} 
  
  // ----------------------------------------------------------------------
  // --- Endpoints לניהול (Admin Console) ---
  // ----------------------------------------------------------------------
  
  // POST /categories
  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }
    
  // GET /categories
  // 🚨 מיועד ל-Admin Console: מחזיר את כל הנתונים, כולל ה-JOIN למוצרים (נתונים כבדים).
  @Get()
  findAll(): Promise<Category[]> {
    // הנחה: השם של הפונקציה עודכן ב-Service
    return this.categoriesService.findAllForAdmin(); 
  }

  // ----------------------------------------------------------------------
  // 🟢 ה-ENDPOINT החדש ל-WEB ול-APP: נתונים קלים ואופטימליים
  // ----------------------------------------------------------------------

  // GET /categories/nav
  // הנתיב הזה מיועד ל-Frontend הציבורי (Web/App)
  @Get('nav') 
  // 🔑 חובה: הגדרת ה-DTO שיבצע את הטרנספורמציה (הסתרת שדות כבדים)
  @SerializeOptions({ type: CategoryNavDto }) 
  async findAllNav(): Promise<CategoryNavDto[]> {
    // קוראים לפונקציה היעילה ב-Service (ללא JOIN למוצרים)
    const categories = await this.categoriesService.findAllForUi();
    
    // ה-Interceptor מטפל בהחזרה כ-CategoryNavDto[]
    return categories as CategoryNavDto[]; 
  }
  
  // ----------------------------------------------------------------------
  // --- Endpoints CRUD קיימים ---
  // ----------------------------------------------------------------------

  // GET /categories/:id
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  // PUT /categories/:id
  @Put(':id')
  update(
    @Param('id') id: number, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // DELETE /categories/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}