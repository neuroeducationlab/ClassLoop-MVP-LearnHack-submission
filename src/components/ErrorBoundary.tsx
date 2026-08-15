import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-canvas p-6 text-center font-sans">
          <div className="w-full max-w-md space-y-4 rounded-3xl border border-pink-200 bg-paper p-8 shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-xl font-bold text-ink">เกิดข้อผิดพลาดขึ้นในระบบ</h1>
            <p className="text-xs text-grey-600 leading-relaxed">
              {this.state.error?.message || 'ระบบเกิดข้อผิดพลาดบางอย่าง โปรดลองกดโหลดใหม่อีกครั้ง'}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-pink-600/90 transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>รีโหลดหน้านี้ใหม่</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
