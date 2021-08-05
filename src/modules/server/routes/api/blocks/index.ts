import { BlocksService } from '../../../services/blocks/blocks'
import { getOneSchema, getStatusSchema, postDeleteBlocksSchema } from './schemas'
import { FastifyInstance } from 'fastify'
import { HttpError } from '../../../common/errors'

const apiBlocks = async (app: FastifyInstance) => {
  const blocksService = new BlocksService()

  app.get('/update/:blockId', { schema: getOneSchema }, async (request) => {
    const {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      params: { blockId }
    } = request

    if (blockId == null) {
      throw new HttpError('param :blockId is required', 400)
    }

    await blocksService.processBlock(parseInt(blockId))

    return { result: true }
  })

  app.get('/status', { schema: getStatusSchema }, async () => {
    return await blocksService.getBlocksStatus()
  })
}

module.exports = apiBlocks
