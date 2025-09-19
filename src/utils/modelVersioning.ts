// Model Versioning and A/B Testing System
export interface ModelVersion {
  version: string;
  timestamp: number;
  performance: {
    accuracy: number;
    inference_time: number;
    user_satisfaction: number;
  };
  architecture: {
    layers: number[];
    activation_functions: string[];
    learning_rate: number;
  };
  deployment_status: 'active' | 'testing' | 'deprecated';
}

export class ModelVersionManager {
  private static instance: ModelVersionManager;
  private versions: Map<string, ModelVersion> = new Map();
  private currentVersion = 'v2.0.0';

  static getInstance(): ModelVersionManager {
    if (!ModelVersionManager.instance) {
      ModelVersionManager.instance = new ModelVersionManager();
    }
    return ModelVersionManager.instance;
  }

  constructor() {
    this.initializeDefaultVersions();
  }

  private initializeDefaultVersions() {
    // Production model
    this.versions.set('v2.0.0', {
      version: 'v2.0.0',
      timestamp: Date.now(),
      performance: {
        accuracy: 0.892,
        inference_time: 1.2,
        user_satisfaction: 4.3
      },
      architecture: {
        layers: [8, 64, 32, 16, 5],
        activation_functions: ['relu', 'relu', 'relu', 'softmax'],
        learning_rate: 0.001
      },
      deployment_status: 'active'
    });

    // Experimental model with different architecture
    this.versions.set('v2.1.0-beta', {
      version: 'v2.1.0-beta',
      timestamp: Date.now() + 1000,
      performance: {
        accuracy: 0.895,
        inference_time: 0.8,
        user_satisfaction: 4.1
      },
      architecture: {
        layers: [8, 128, 64, 32, 5],
        activation_functions: ['relu', 'relu', 'relu', 'softmax'],
        learning_rate: 0.0015
      },
      deployment_status: 'testing'
    });
  }

  // A/B Testing Logic
  selectModelForUser(userId?: string): string {
    if (!userId) {
      return this.currentVersion;
    }

    // Hash user ID to determine test group
    const hash = this.hashString(userId);
    const testGroup = hash % 100;

    // 10% of users get the experimental model
    if (testGroup < 10 && this.versions.has('v2.1.0-beta')) {
      return 'v2.1.0-beta';
    }

    return this.currentVersion;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Performance Monitoring
  updateModelPerformance(version: string, metrics: {
    accuracy?: number;
    inference_time?: number;
    user_satisfaction?: number;
  }) {
    const model = this.versions.get(version);
    if (model) {
      model.performance = { ...model.performance, ...metrics };
      model.timestamp = Date.now();
      
      // Auto-promote high-performing models
      if (model.deployment_status === 'testing' && 
          model.performance.accuracy > 0.9 && 
          model.performance.user_satisfaction > 4.0) {
        this.promoteModel(version);
      }
    }
  }

  promoteModel(version: string) {
    const model = this.versions.get(version);
    if (model && model.deployment_status === 'testing') {
      // Deprecate current production model
      const currentModel = this.versions.get(this.currentVersion);
      if (currentModel) {
        currentModel.deployment_status = 'deprecated';
      }

      // Promote new model
      model.deployment_status = 'active';
      this.currentVersion = version;
      
      console.log(`🚀 Model ${version} promoted to production!`);
    }
  }

  rollbackModel(): boolean {
    // Find the most recent deprecated model with good performance
    const deprecatedVersions = Array.from(this.versions.values())
      .filter(v => v.deployment_status === 'deprecated')
      .sort((a, b) => b.timestamp - a.timestamp);

    if (deprecatedVersions.length > 0) {
      const rollbackVersion = deprecatedVersions[0];
      rollbackVersion.deployment_status = 'active';
      
      // Deprecate current model
      const currentModel = this.versions.get(this.currentVersion);
      if (currentModel) {
        currentModel.deployment_status = 'deprecated';
      }

      this.currentVersion = rollbackVersion.version;
      console.log(`⏪ Rolled back to model ${rollbackVersion.version}`);
      return true;
    }

    return false;
  }

  // Getters
  getCurrentVersion(): string {
    return this.currentVersion;
  }

  getVersionInfo(version: string): ModelVersion | undefined {
    return this.versions.get(version);
  }

  getAllVersions(): ModelVersion[] {
    return Array.from(this.versions.values());
  }

  getActiveVersions(): ModelVersion[] {
    return Array.from(this.versions.values())
      .filter(v => v.deployment_status === 'active' || v.deployment_status === 'testing');
  }

  // Export/Import for persistence
  exportVersions(): string {
    return JSON.stringify(Array.from(this.versions.entries()));
  }

  importVersions(data: string) {
    try {
      const entries = JSON.parse(data);
      this.versions = new Map(entries);
    } catch (error) {
      console.error('Failed to import model versions:', error);
    }
  }
}

// Singleton instance
export const modelVersionManager = ModelVersionManager.getInstance();
