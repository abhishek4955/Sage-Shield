import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';
import { PAGES } from '../config/pages';

interface SettingsField {
  id: string;
  label: string;
  type: 'number' | 'select' | 'toggle' | 'text';
  value: string | number | boolean;
  options?: string[];
}

interface SettingsSection {
  title: string;
  description: string;
  fields: SettingsField[];
}

export function Settings() {
  const [settings, setSettings] = useState<SettingsSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_ENDPOINTS.SETTINGS, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'omit'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch settings: ${response.status}`);
        }

        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = async (
    sectionIndex: number,
    fieldIndex: number,
    value: string | number | boolean
  ) => {
    const newSettings = [...settings];
    newSettings[sectionIndex].fields[fieldIndex].value = value;
    setSettings(newSettings);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(API_ENDPOINTS.SETTINGS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      // Show success message or notification here
    } catch (err) {
      setError('Error saving settings');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg border border-red-200 bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{PAGES.SETTINGS.title}</h1>
        <button
          onClick={handleSave}
          disabled={loading || saving}
          className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
            loading || saving
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
              <div className="animate-pulse space-y-2">
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-4">
                {Array(2).fill(0).map((_, j) => (
                  <div key={j} className="animate-pulse space-y-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          settings.map((section, sectionIndex) => (
            <div key={section.title} className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
              <div className="space-y-4">
                {section.fields.map((field, fieldIndex) => (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="text-sm font-medium">
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        id={field.id}
                        value={field.value as string}
                        onChange={(e) =>
                          handleSettingChange(sectionIndex, fieldIndex, e.target.value)
                        }
                        className="w-full rounded-md border bg-background px-3 py-2"
                      >
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'toggle' ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleSettingChange(sectionIndex, fieldIndex, !field.value)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          field.value ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            field.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : (
                      <input
                        type={field.type}
                        id={field.id}
                        value={field.value as string | number}
                        onChange={(e) =>
                          handleSettingChange(
                            sectionIndex,
                            fieldIndex,
                            field.type === 'number'
                              ? parseFloat(e.target.value)
                              : e.target.value
                          )
                        }
                        className="w-full rounded-md border bg-background px-3 py-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 