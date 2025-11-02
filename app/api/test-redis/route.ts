import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!url || !token) {
      return NextResponse.json({
        status: 'not_configured',
        message: 'Upstash Redis credentials not found in environment variables',
        note: 'Server will work without caching'
      }, { status: 200 });
    }
    
    const redis = Redis.fromEnv();
    
    await redis.set('test_connection', 'success', { ex: 60 });
    const result = await redis.get('test_connection');
    
    return NextResponse.json({
      status: 'connected',
      message: 'Upstash Redis connection successful',
      test_result: result,
      url: url.substring(0, 30) + '...'
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      note: 'Server will work without caching'
    }, { status: 500 });
  }
}

