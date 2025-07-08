import {model, Schema, models} from 'mongoose';

const blogSchema = new Schema ({
        id: String,
        title: String,
        slug: String,
      categories: {
        primary: String,
        secondary: String
      },
      featured_hero: Boolean,
      featured_articles: Boolean,
      featured_subhero: Boolean,
      author: String || {
        name: String,
        profileUrl: String,
        
      },
      publishedAt: String,
      updatedAt: String,
      excerpt: String,
      content: String,
      summary: String, 
      featuredImage: {
        url: String,
        alt: String,
        width: Number,
        height: Number,
      },
      seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: String,
        canonicalUrl: String,
        ogTitle: String,
        ogDescription: String,
        ogImage: String,
        twitterTitle: String,
        twitterDescription: String,
        twitterImage: String,
        twitterCard: String,
        structuredData: {
            '@context': String,
            '@type': String,
            headline: String,
            description: String,
            image: String,
            datePublished: String,
            dateModified: String,
            author:{
                '@type': String,
                name: String,
                url: String,
            },
            publisher: {
                '@type': String,
                name: String,
                logo: {
                    '@type': String,
                    url: String,
                }
            }
        }
      }
    
})

//const permission = 'User' || 'Admin'

 const userSchema = new Schema ({
  username: String, 
  email: String, 
  password: String, 
  createdAt: String, 
  image: String, 
  permissions: String, 
  bio: String,
  name: String 
})

var featuredArticlesSchema = new Schema (
  {
    id: String,
    title: String,
    slug: String,
  categories: {
    primary: String,
    secondary: String
  },
  featured_hero: Boolean,
  featured_articles: Boolean,
  featured_subhero: Boolean,
  author: String || {
    name: String,
    profileUrl: String,
    bio: String,
  },
  publishedAt: String,
  updatedAt: String,
  excerpt: String,
  content: String,
  summary: String, 
  featuredImage: {
    url: String,
    alt: String,
    width: Number,
    height: Number,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String,
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    twitterTitle: String,
    twitterDescription: String,
    twitterImage: String,
    twitterCard: String,
    structuredData: {
        '@context': String,
        '@type': String,
        headline: String,
        description: String,
        image: String,
        datePublished: String,
        dateModified: String,
        author:{
            '@type': String,
            name: String,
            url: String,
        },
        publisher: {
            '@type': String,
            name: String,
            logo: {
                '@type': String,
                url: String,
            }
        }
    }
  }

}
)

export const UserDB = models.users || model('users', userSchema)
export const ArticleDB = models.articles || model('articles', blogSchema )
export const featuredArticles = models.featuredArticles || model('featuredArticles', featuredArticlesSchema)

