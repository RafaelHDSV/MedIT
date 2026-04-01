import mongoose from 'mongoose'
import { IAdmin } from '../interfaces/IAdmin'

const AdminSchema = new mongoose.Schema<IAdmin>()

export default AdminSchema
