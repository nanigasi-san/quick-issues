/** @babel */
import GhIssuesView from './gh-issues-view';
import {CompositeDisposable} from 'atom';
import config from './config';

const GH_ISSUES_RE = /^quick-issues-2:\/\//;

module.exports = {

  config,

  views: null,
  subscriptions: null,

  activate(state) {
    this.views = [];

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that opens this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'quick-issues-2:toggle': () => this.toggle(),
    }));

    atom.workspace.addOpener((uri) => {
        if (!uri.match(GH_ISSUES_RE)) return;
        const view = new GhIssuesView();
        this.views.push(view);
        return view;
    });
  },

  deactivate() {
    this.subscriptions.dispose();
    this.views.forEach((v) => v.destroy());
  },

  serialize() {
    return {
      githubIssuesViewState: this.views.map((v) => v.serialize()),
    };
  },

  toggle() {
    const exists = (element) => element instanceof GhIssuesView;
    const panes = atom.workspace.getRightDock().getPaneItems();
    if (panes.some(exists)) {
      console.log(atom.workspace.getRightDock().isVisible());
      if (atom.workspace.getRightDock().isVisible()) {
        if (atom.workspace.getRightDock().getActivePaneItem() instanceof GhIssuesView) {
          atom.workspace.getRightDock().hide();
        } else {
          atom.workspace.toggle('quick-issues-2:///');
        }
      } else {
        atom.workspace.toggle('quick-issues-2:///');
          }
        } else {
      this.views.pop(0);
      atom.workspace.open('quick-issues-2:///');
    }
  },

};

