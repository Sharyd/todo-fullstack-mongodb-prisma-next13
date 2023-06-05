import { ReactNode } from 'react'
import Providers from '../components/auth/Providers'

export interface Todo {
    createdAt?: string
    updatedAt?: string
    userId?: string
    id: string
    todoId: string
    userName?: string | null | undefined
    title: string | undefined
    completed: boolean
    order?: number | undefined | null
}

export interface draggedTodo {
    todoId: string
    index: number
}

export interface userType {
    name?: string | null | undefined
    email?: string | null | undefined
    image?: string | null | undefined
    id?: string | null | undefined
    createdAt?: string | null | undefined
    updatedAt?: string | null | undefined
}

export interface newCommentType {
    content: string
    userId: string
    parentId?: string | undefined
}
export interface Comment {
    parentId: string
    map(arg0: (comment: any) => JSX.Element): ReactNode
    id: string
    content: string
    createdAt: string
    updatedAt: string
    userId: string
    parentCommentId: string | null
    replies?: Comment[]
    user?: userType
    likes?: likeType[]
}
export interface likeType {
    id: string
    userId: string
    commentId: string
}

export interface loggedUserType {
    name?: string | null | undefined
    email?: string | null | undefined
    image?: string | null | undefined
    userId?: string | null | undefined
}

export enum status {
    Accepted = 'Accepted',
    Pending = 'Pending',
    Declined = 'Declined',
}

export interface permissionRequestType {
    filter(arg0: (request: any) => boolean): unknown
    map(
        arg0: (request: any, index: any) => JSX.Element
    ): import('react').ReactNode
    some(arg0: (request: any) => boolean): boolean
    id?: string | null | undefined
    fromUserId?: string | null | undefined
    toUserId?: string | null | undefined
    createdAt?: string | null | undefined
    updatedAt?: string | null | undefined
    status?: string | null | undefined
    fromUserName?: string | null | undefined
}

export interface NotificationType {
    id: string | null | undefined
    userId: string | null | undefined
    message: string | null | undefined
    createdAt?: string | null | undefined
    updatedAt?: string | null | undefined
}

export const ItemTypes = {
    TODO: 'todo',
}
