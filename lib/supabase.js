import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const projectUrl = process.env.SUPABASE_PROJECT_URL;
const projectKey = process.env.SUPABASE_PROJECT_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;


export const supabase = createClient(projectUrl, serviceKey, {
  auth: {
    storage: AsyncStorage
  }
});