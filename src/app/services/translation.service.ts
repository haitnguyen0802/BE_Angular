import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Language } from './settings.service';

// Interface for all translatable text in the application
export interface TranslationSet {
  // Navigation
  dashboard: string;
  categories: string;
  products: string;
  orders: string;
  customers: string;
  settings: string;
  
  // Common actions
  add: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  search: string;
  filter: string;
  reset: string;
  
  // Status labels
  active: string;
  inactive: string;
  pending: string;
  completed: string;
  failed: string;
  
  // Messages
  confirmDelete: string;
  successAdd: string;
  successEdit: string;
  successDelete: string;
  errorOccurred: string;
  
  // Other common labels
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: string;
  status: string;
  date: string;
  actions: string;
  customer: string;
  product: string;
  category: string;
  order: string;
  total: string;
  
  // Dashboard specific
  recentOrders: string;
  viewAll: string;
  overview: string;
  totalRevenue: string;
  totalOrders: string;
  totalProducts: string;
  totalCustomers: string;
  revenue: string;
  week: string;
  month: string;
  year: string;
  
  // User related
  login: string;
  logout: string;
  profile: string;
  username: string;
  password: string;
  email: string;
  role: string;
  administrator: string;
  
  // And more keys that can be added dynamically
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: Record<Language, TranslationSet> = {
    vi: {
      // Navigation
      dashboard: 'Tổng quan',
      categories: 'Danh mục',
      products: 'Sản phẩm',
      orders: 'Đơn hàng',
      customers: 'Khách hàng',
      settings: 'Cài đặt',
      
      // Common actions
      add: 'Thêm mới',
      edit: 'Chỉnh sửa',
      delete: 'Xóa',
      save: 'Lưu',
      cancel: 'Hủy',
      search: 'Tìm kiếm',
      filter: 'Lọc',
      reset: 'Đặt lại',
      
      // Status labels
      active: 'Đang hoạt động',
      inactive: 'Không hoạt động',
      pending: 'Đang chờ',
      completed: 'Hoàn thành',
      failed: 'Thất bại',
      
      // Messages
      confirmDelete: 'Bạn có chắc chắn muốn xóa?',
      successAdd: 'Thêm mới thành công!',
      successEdit: 'Cập nhật thành công!',
      successDelete: 'Xóa thành công!',
      errorOccurred: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
      
      // Other common labels
      id: 'Mã',
      name: 'Tên',
      description: 'Mô tả',
      price: 'Giá',
      quantity: 'Số lượng',
      status: 'Trạng thái',
      date: 'Ngày',
      actions: 'Thao tác',
      customer: 'Khách hàng',
      product: 'Sản phẩm',
      category: 'Danh mục',
      order: 'Đơn hàng',
      total: 'Tổng',
      
      // Dashboard specific
      recentOrders: 'Đơn hàng gần đây',
      viewAll: 'Xem tất cả',
      overview: 'Tổng quan',
      totalRevenue: 'Tổng doanh thu',
      totalOrders: 'Tổng đơn hàng',
      totalProducts: 'Tổng sản phẩm',
      totalCustomers: 'Tổng khách hàng',
      revenue: 'Doanh thu',
      week: 'Tuần',
      month: 'Tháng',
      year: 'Năm',
      
      // User related
      login: 'Đăng nhập',
      logout: 'Đăng xuất',
      profile: 'Hồ sơ',
      username: 'Tên đăng nhập',
      password: 'Mật khẩu',
      email: 'Email',
      role: 'Vai trò',
      administrator: 'Quản trị viên'
    },
    en: {
      // Navigation
      dashboard: 'Dashboard',
      categories: 'Categories',
      products: 'Products',
      orders: 'Orders',
      customers: 'Customers',
      settings: 'Settings',
      
      // Common actions
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      search: 'Search',
      filter: 'Filter',
      reset: 'Reset',
      
      // Status labels
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      completed: 'Completed',
      failed: 'Failed',
      
      // Messages
      confirmDelete: 'Are you sure you want to delete?',
      successAdd: 'Added successfully!',
      successEdit: 'Updated successfully!',
      successDelete: 'Deleted successfully!',
      errorOccurred: 'An error occurred. Please try again later.',
      
      // Other common labels
      id: 'ID',
      name: 'Name',
      description: 'Description',
      price: 'Price',
      quantity: 'Quantity',
      status: 'Status',
      date: 'Date',
      actions: 'Actions',
      customer: 'Customer',
      product: 'Product',
      category: 'Category',
      order: 'Order',
      total: 'Total',
      
      // Dashboard specific
      recentOrders: 'Recent Orders',
      viewAll: 'View All',
      overview: 'Overview',
      totalRevenue: 'Total Revenue',
      totalOrders: 'Total Orders',
      totalProducts: 'Total Products',
      totalCustomers: 'Total Customers',
      revenue: 'Revenue',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      
      // User related
      login: 'Login',
      logout: 'Logout',
      profile: 'Profile',
      username: 'Username',
      password: 'Password',
      email: 'Email',
      role: 'Role',
      administrator: 'Administrator'
    },
    zh: {
      // Navigation
      dashboard: '仪表板',
      categories: '类别',
      products: '产品',
      orders: '订单',
      customers: '客户',
      settings: '设置',
      
      // Common actions
      add: '添加',
      edit: '编辑',
      delete: '删除',
      save: '保存',
      cancel: '取消',
      search: '搜索',
      filter: '筛选',
      reset: '重置',
      
      // Status labels
      active: '活动的',
      inactive: '非活动的',
      pending: '待处理',
      completed: '已完成',
      failed: '失败',
      
      // Messages
      confirmDelete: '您确定要删除吗？',
      successAdd: '添加成功！',
      successEdit: '更新成功！',
      successDelete: '删除成功！',
      errorOccurred: '发生错误。请稍后再试。',
      
      // Other common labels
      id: '编号',
      name: '名称',
      description: '描述',
      price: '价格',
      quantity: '数量',
      status: '状态',
      date: '日期',
      actions: '操作',
      customer: '客户',
      product: '产品',
      category: '类别',
      order: '订单',
      total: '总计',
      
      // Dashboard specific
      recentOrders: '最近订单',
      viewAll: '查看全部',
      overview: '概览',
      totalRevenue: '总收入',
      totalOrders: '总订单',
      totalProducts: '总产品',
      totalCustomers: '总客户',
      revenue: '收入',
      week: '周',
      month: '月',
      year: '年',
      
      // User related
      login: '登录',
      logout: '登出',
      profile: '个人资料',
      username: '用户名',
      password: '密码',
      email: '电子邮件',
      role: '角色',
      administrator: '管理员'
    },
    ja: {
      // Navigation
      dashboard: 'ダッシュボード',
      categories: 'カテゴリ',
      products: '製品',
      orders: '注文',
      customers: '顧客',
      settings: '設定',
      
      // Common actions
      add: '追加',
      edit: '編集',
      delete: '削除',
      save: '保存',
      cancel: 'キャンセル',
      search: '検索',
      filter: 'フィルター',
      reset: 'リセット',
      
      // Status labels
      active: 'アクティブ',
      inactive: '非アクティブ',
      pending: '保留中',
      completed: '完了',
      failed: '失敗',
      
      // Messages
      confirmDelete: '本当に削除しますか？',
      successAdd: '正常に追加されました！',
      successEdit: '正常に更新されました！',
      successDelete: '正常に削除されました！',
      errorOccurred: 'エラーが発生しました。後でもう一度お試しください。',
      
      // Other common labels
      id: 'ID',
      name: '名前',
      description: '説明',
      price: '価格',
      quantity: '数量',
      status: 'ステータス',
      date: '日付',
      actions: 'アクション',
      customer: '顧客',
      product: '製品',
      category: 'カテゴリ',
      order: '注文',
      total: '合計',
      
      // Dashboard specific
      recentOrders: '最近の注文',
      viewAll: 'すべて表示',
      overview: '概要',
      totalRevenue: '総収益',
      totalOrders: '総注文数',
      totalProducts: '総製品数',
      totalCustomers: '総顧客数',
      revenue: '収益',
      week: '週',
      month: '月',
      year: '年',
      
      // User related
      login: 'ログイン',
      logout: 'ログアウト',
      profile: 'プロフィール',
      username: 'ユーザー名',
      password: 'パスワード',
      email: 'メール',
      role: '役割',
      administrator: '管理者'
    }
  };
  
  private currentLanguageSubject = new BehaviorSubject<Language>('vi');
  currentLanguage$ = this.currentLanguageSubject.asObservable();
  
  private currentTranslationSubject = new BehaviorSubject<TranslationSet>(this.translations.vi);
  currentTranslation$ = this.currentTranslationSubject.asObservable();
  
  constructor() {}
  
  /**
   * Set the current language
   */
  setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);
    this.currentTranslationSubject.next(this.translations[language]);
  }
  
  /**
   * Get translation value for a key
   */
  get(key: keyof TranslationSet): string {
    const value = this.currentTranslationSubject.value[key];
    return value || String(key);
  }
  
  /**
   * Get the current translation set
   */
  getTranslation(): TranslationSet {
    return this.currentTranslationSubject.value;
  }
  
  /**
   * Add new translations to the existing translations
   */
  addTranslations(newTranslations: Record<Language, Partial<TranslationSet>>): void {
    Object.keys(newTranslations).forEach(lang => {
      const language = lang as Language;
      if (this.translations[language]) {
        const typeSafeTranslations: Record<string, string> = {};
        
        Object.entries(newTranslations[language]).forEach(([key, value]) => {
          if (value !== undefined) {
            typeSafeTranslations[key] = value;
          }
        });
        
        this.translations[language] = {
          ...this.translations[language],
          ...typeSafeTranslations
        };
      }
    });
    
    const currentLang = this.currentLanguageSubject.value;
    this.currentTranslationSubject.next(this.translations[currentLang]);
  }
} 