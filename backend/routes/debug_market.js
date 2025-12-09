import { enhancedMarketDataService } from '../services/enhancedMarketDataService.js';

export default async function debugRoutes(fastify, options) {
    // Debug MarketStack integration
    fastify.get('/debug-market-data', async (request, reply) => {
        try {
            console.log('🔧 Starting market data test...');
            
            // Test with some Indian stocks
            const testSymbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK'];
            console.log('📊 Test symbols:', testSymbols);
            
            console.log('🔄 Calling enhancedMarketDataService...');
            const marketData = await enhancedMarketDataService.getRealTimePrices(testSymbols);
            console.log('✅ Service returned:', Object.keys(marketData));
            
            return {
                success: true,
                dataSource: 'MarketStack + Alpha Vantage',
                marketData: marketData,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Market data test error:', error);
            console.error('❌ Error stack:', error.stack);
            return reply.code(500).send({
                success: false,
                error: 'Market data test failed',
                details: error.message
            });
        }
    });
}
