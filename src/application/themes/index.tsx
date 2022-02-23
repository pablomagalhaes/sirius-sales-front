const primary = '#43BFB5'

const dark = {
  commercial: {
    fontColor: '#F2F3F7',
    components: {
      itemModal: {
        backgroundColor: '#222E3E',
        border: '#364353',
        fontColor: '#B5B8C2',
        iconColor: '#FFFFFF',
        inputFontColor: '#F2F3F7',
        titleColor: '#F2F3F7',
        disabledBackground: '#C2C5D1',
        replyIconColor: '#43BFB5',
        redAsterisk: '#FF7373'
      },
      costTable: {
        backgroundColor: '#151D28',
        title: '#F2F3F7',
        subtitle: '#B5B8C2',
        emptyLabel: '#B5B8C2'
      }
    },
    pages: {
      home: {
        mainColor: '#151D28'
      },
      proposal: {
        tableHeader: '#B5B8C2',
        dropdownColor: '#B5B8C2',
        breadcrumbInitial: '#B5B8C2',
        breadcrumbEnd: '#F2F3F7'
      },
      newProposal: {
        background: '#222E3E',
        title: '#F2F3F7',
        subtitle: '#B5B8C2',
        border: '#505F73',
        font: '#F2F3F7',
        placeholder: '#7B8A9E',
        steps: {
          stepFare: '#B5B8C2'
        }
      }
    }
  }
}

const light = {
  commercial: {
    fontColor: '#222222',
    components: {
      itemModal: {
        backgroundColor: '#FFFFFF',
        border: '#E3E5EB',
        fontColor: '#545454',
        iconColor: '#222222',
        inputFontColor: '#222222',
        titleColor: '#222222',
        disabledBackground: '#E3E5EB',
        replyIconColor: '#1F6660',
        redAsterisk: '#FF4D4D'
      },
      costTable: {
        backgroundColor: '#f0f1f5',
        title: '#222222',
        subtitle: '#545454',
        emptyLabel: '#999DAC'
      }
    },
    pages: {
      home: {
        mainColor: '#F2F3F7'
      },
      proposal: {
        tableHeader: '#545454',
        dropdownColor: '#222222',
        breadcrumbInitial: '#545454',
        breadcrumbEnd: '#222222'
      },
      newProposal: {
        background: '#FFFFFF',
        title: '#000000',
        subtitle: '#545454',
        border: '#F0F1F5',
        font: '#222222',
        placeholder: '#999DAC',
        steps: {
          stepFare: '#545454'
        }
      }
    }
  }
}

export { light, dark, primary }
