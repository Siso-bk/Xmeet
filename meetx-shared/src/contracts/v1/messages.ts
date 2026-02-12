import type { ApiResponse, Paginated } from '../../types/common'
import type { Message } from '../../types/messaging'

export type MessagesResponse = ApiResponse<Paginated<Message>>
