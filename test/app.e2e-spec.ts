import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3333/');
    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: 'admin',
    };
    describe('Signup', () => {
      it('should throw error if email not found', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
          .expectBodyContains(dto.email)
      });

      it('should throw error if Password not found', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw error if no body', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .expectStatus(400);
      });
      it('signup', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw error if email not found', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw error if Password not found', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw error if no body', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .expectStatus(400);
      });
      it('signin', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt','access_token')
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user',()=>{
        return pactum
        .spec()
          .get('users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
      })
    });
    describe('Edit user', () => {
      it('should get edit user',()=>{
        const dto:EditUserDto = {
          firstName:"Test",
          email:'test@gmail.com',
        }
        return pactum
        .spec()
          .patch('users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(200)
      })
    });
  });

  describe('Bookmarks', () => {
    describe('Get Empty bookmarks', () => {
      it("should get book marks",()=>{
        return pactum
          .spec()
          .get('bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          // .expectBody([])
      })
    })
    describe('Create bookmarks', () => {
      const dto:CreateBookmarkDto={
        title:"First Bookmark",
        link:'https://www.youtube.com/watch?v=GHTA143_b-s&t=12244s'
      }
      it('should create book mark',()=>{
          return pactum
            .spec()
            .post('bookmark')
            .withBody(dto)
            .withHeaders({
              Authorization: 'Bearer $S{userAt}'
            })
            .expectStatus(201)
            .stores('bookmarkId','id')
        })
    });
    describe('Get bookmarks', () => {
      it("should get book marks",()=>{
        return pactum
          .spec()
          .get('bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200).inspect()
          // .expectJsonLength(1);
      })
    });
    describe('Get bookmark by id', () => {});
    describe('Edit bookmark', () => {});
    describe('Delete bookmark', () => {});
  });
});
