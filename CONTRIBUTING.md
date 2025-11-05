# Contributing to Seismicity Analysis Platform

Thank you for your interest in contributing to the Seismicity Analysis Platform! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Seismicity-app.git
   cd Seismicity-app
   ```
3. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```
4. **Create a branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Application

```bash
cd frontend
npm start
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Code Structure

### Directory Layout

```
frontend/
├── public/               # Static assets
│   ├── bootstrap/       # Bootstrap CSS/JS (VLab template)
│   ├── dist/           # AdminLTE theme files
│   ├── plugins/        # jQuery and plugins
│   ├── images/         # VLab branding
│   ├── isc-gem-cat.csv # Main earthquake catalogue
│   └── isc-gem-suppl.csv # Supplementary catalogue
├── src/
│   ├── components/     # Reusable React components
│   │   ├── MapComponent.js
│   │   ├── GutenbergRichterGraph.js
│   │   ├── DepthDistributionChart.js
│   │   ├── TemporalAnalysis.js
│   │   └── MagnitudeDistribution.js
│   ├── pages/          # VLab page components
│   │   ├── Aim.js
│   │   ├── Theory.js
│   │   ├── PreTest.js
│   │   ├── Procedure.js
│   │   ├── Simulation.js
│   │   ├── PostTest.js
│   │   └── References.js
│   ├── utils/          # Helper utilities
│   │   ├── csvParser.js
│   │   └── grCalculator.js
│   ├── App.js          # Main simulation component
│   ├── VLabWrapper.js  # VLab layout and routing
│   ├── index.js        # Application entry point
│   └── index.css       # Global styles
└── package.json
```

## Contribution Guidelines

### Code Style

- Use **ES6+** JavaScript features
- Use **functional components** with hooks (no class components)
- Follow **React best practices**
- Use **meaningful variable names**
- Add **comments** for complex logic
- Keep functions **small and focused**

### Component Guidelines

#### Educational Pages (pages/)
- Use VLabLayout wrapper for consistent design
- Follow AdminLTE box/callout patterns
- Maintain educational content structure
- Use appropriate Font Awesome icons

#### Visualization Components (components/)
- Ensure responsive design
- Handle empty data gracefully
- Include loading states
- Add educational context where appropriate

### Styling

- **VLab pages**: Use Bootstrap 3 classes and AdminLTE components
- **Simulation**: Use Tailwind CSS utility classes
- Maintain consistency with existing design
- Test responsive behavior (mobile, tablet, desktop)

### Data Handling

- All CSV parsing happens in `csvParser.js`
- Earthquake filtering should be optimized for performance
- Handle edge cases (no data, invalid coordinates, etc.)
- Validate user inputs

## Types of Contributions

### Bug Fixes
- Fix issues with existing functionality
- Improve error handling
- Optimize performance

### New Features
- Add new visualization types
- Enhance educational content
- Improve user experience
- Add accessibility features

### Documentation
- Improve README
- Add code comments
- Update user guides
- Create tutorials

### Educational Content
- Improve theory explanations
- Add more quiz questions
- Enhance procedure steps
- Add new references

## Testing Your Changes

Before submitting a pull request:

1. **Test all navigation**: Ensure all VLab sections work
2. **Test simulation**: Verify search, filtering, and visualizations
3. **Test responsiveness**: Check on different screen sizes
4. **Check console**: No errors or warnings
5. **Verify data loading**: CSV loads properly
6. **Test edge cases**: Empty results, invalid inputs, etc.

### Sample Test Cases

- Search with various coordinates (Japan, California, Chile, etc.)
- Test minimum magnitude filtering (5.0, 6.0, 7.0)
- Test date range filtering
- Test small and large radius values
- Navigate through all tabs
- Complete Pre-Test and Post-Test
- Verify all visualizations render correctly

## Submitting Changes

1. **Commit your changes** with clear messages:
   ```bash
   git add .
   git commit -m "Add feature: description of changes"
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub:
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots if UI changes
   - List what was tested

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] No console errors or warnings
- [ ] Tested on multiple screen sizes
- [ ] All VLab sections work correctly
- [ ] Simulation functions properly
- [ ] Documentation updated (if needed)
- [ ] No unnecessary files included (*.bak, node_modules, etc.)

## Reporting Issues

### Bug Reports

Include:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser and OS information
- Console error messages

### Feature Requests

Include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Mockups or examples (if applicable)

## Questions?

If you have questions about contributing:
- Open an issue on GitHub
- Check existing issues and pull requests
- Review the README and documentation

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the project goals

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Seismicity Analysis Platform! 🌍📊
